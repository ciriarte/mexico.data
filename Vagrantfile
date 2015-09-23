# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.provider "parallels" do |v|
    v.update_guest_tools = true
  end

  #config.ssh.username = 'root'
  #config.ssh.password = 'vagrant'
  #config.ssh.insert_key = 'true'

  config.vm.define :web do |web|
    # Centos 7.1
    web.vm.box = "vagrant-centos7.1"

    # Network
    web.vm.hostname = "web.dev"
    web.vm.network :forwarded_port, guest: 9000, host: 8080, auto_correct: true
    web.vm.network :forwarded_port, guest: 5432, host: 15432
    # Share for masterless server
    web.vm.synced_folder "salt/roots/", "/srv/"

    web.vm.provision :salt do |salt|
      # Configure the minion
      salt.minion_config = "salt/minion.conf"

      # Show the output of salt
      salt.log_level = "debug"

      # Run the highstate on start
      salt.run_highstate = true
    end
  end

  config.vm.provision :hostsupdate, run: 'always' do |host| 
    host.hostname = 'web.dev'
    host.manage_guest = true
    host.manage_host  = true
  end
end
