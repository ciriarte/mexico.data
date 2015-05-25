# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.provider "parallels" do |v|
    v.update_guest_tools = true
  end

  config.vm.define :web do |web|
    # Centos 7.1
    web.vm.box = "vagrant-centos7.1"

    # Network
    web.vm.hostname = "web.local"
    web.vm.network :forwarded_port, guest: 9000, host: 8080, auto_correct: true

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
end
